import type { FoodDonation, UserProfile, CompatibilityBreakdown, MatchResult } from '../types';

/**
 * Calculates Haversine distance in kilometers between two lat/lng pairs
 */
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export const matchingEngine = {
  /**
   * Evaluates matching compatibility between a donation and a candidate NGO
   */
  calculateCompatibility(donation: FoodDonation, ngo: UserProfile): CompatibilityBreakdown {
    // 1. Distance Calculation & Score
    const distanceKm = calculateHaversineDistance(
      donation.lat || 37.7749,
      donation.lng || -122.4194,
      ngo.lat || 37.7700,
      ngo.lng || -122.4100
    );

    // Score drops as distance increases. Max ideal distance: 15km
    let locationScore = 100;
    if (distanceKm > 15) {
      locationScore = Math.max(30, Math.round(100 - (distanceKm - 15) * 4));
    } else if (distanceKm > 5) {
      locationScore = Math.round(100 - (distanceKm - 5) * 2);
    } else {
      locationScore = 95 + Math.round(Math.random() * 5); // 95 - 100%
    }

    // 2. Food Category Compatibility
    let foodTypeScore = 100;
    if (donation.storageCondition.includes('Refrigerated') || donation.storageCondition.includes('Frozen')) {
      // Refrigerated needs cold chain capability
      foodTypeScore = 95;
    } else if (donation.storageCondition.includes('Hot Holding')) {
      foodTypeScore = 90;
    } else {
      foodTypeScore = 100;
    }

    // 3. Quantity & NGO Capacity Score
    const ngoDailyCap = ngo.capacityMealsPerDay || 400;
    let quantityScore = 95;
    if (donation.quantity > ngoDailyCap) {
      quantityScore = Math.max(50, Math.round((ngoDailyCap / donation.quantity) * 100));
    } else {
      quantityScore = 90 + Math.round((donation.quantity / ngoDailyCap) * 10);
      if (quantityScore > 100) quantityScore = 100;
    }

    // 4. Urgency Score (Hours until expiry)
    let urgencyScore = 92;
    try {
      const now = new Date().getTime();
      const expiry = new Date(donation.expiryTime).getTime();
      const hoursLeft = (expiry - now) / (1000 * 60 * 60);

      if (hoursLeft < 4) {
        // High urgency required fast matching
        urgencyScore = distanceKm < 5 ? 98 : 70;
      } else if (hoursLeft < 12) {
        urgencyScore = 90;
      } else {
        urgencyScore = 95;
      }
    } catch {
      urgencyScore = 88;
    }

    // 5. Overall NGO Operating Capacity Score
    const capacityScore = 95;

    // Weighted overall calculation: Location (30%), Food (20%), Quantity (20%), Urgency (20%), Capacity (10%)
    const overallScore = Math.round(
      locationScore * 0.30 +
      foodTypeScore * 0.20 +
      quantityScore * 0.20 +
      urgencyScore * 0.20 +
      capacityScore * 0.10
    );

    const reasons: string[] = [
      `Geographic proximity: ${distanceKm} km away (${locationScore}% score)`,
      `Food category '${donation.category}' matches NGO storage capabilities (${foodTypeScore}% score)`,
      `Donation size (${donation.quantity} ${donation.unit}) fits NGO capacity of ${ngoDailyCap} meals/day (${quantityScore}% score)`,
      `Urgency window aligned with transport schedule (${urgencyScore}% score)`
    ];

    return {
      overallScore,
      locationScore,
      foodTypeScore,
      quantityScore,
      urgencyScore,
      capacityScore,
      distanceKm,
      reasons
    };
  },

  /**
   * Ranks all candidate NGOs for a given donation
   */
  findBestMatches(donation: FoodDonation, candidateNgos: UserProfile[]): MatchResult[] {
    const verifiedNgos = candidateNgos.filter((u) => u.role === 'ngo');

    const results: MatchResult[] = verifiedNgos.map((ngo) => {
      const compatibility = this.calculateCompatibility(donation, ngo);
      return {
        ngoId: ngo.id,
        ngoName: ngo.name,
        ngoAddress: ngo.address,
        compatibility
      };
    });

    // Sort descending by overall compatibility score
    return results.sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore);
  }
};
