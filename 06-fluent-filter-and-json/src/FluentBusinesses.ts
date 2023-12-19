import type { Business } from "../include/data.js";

export class FluentBusinesses {
  private data: Business[];

  constructor(data: Business[]) {
    this.data = data;
  }

  getData(): Business[] {
    return this.data;
  }

  fromCityInState(city: string, state: string): FluentBusinesses {
    return new FluentBusinesses(this.data.filter(a => a.city === city && a.state === state));
  }

  hasStarsGeq(stars: number): FluentBusinesses {
    // TODO
    return new FluentBusinesses(this.data.filter(a => a.stars !== undefined && a.stars >= stars));
  }

  inCategory(category: string): FluentBusinesses {
    // TODO
    return new FluentBusinesses(this.data.filter(a => a.categories !== undefined && a.categories.includes(category)));
  }

  hasHoursOnDays(days: string[]): FluentBusinesses {
    // TODO
    return new FluentBusinesses(
      this.data.filter(a => days.every(c => a.hours !== undefined && Object.keys(a.hours).includes(c)))
    );
  }

  hasAmbience(ambience: string): FluentBusinesses {
    // TODO
    return new FluentBusinesses(
      this.data.filter(a => {
        if (a.attributes === undefined) return false;
        if (
          a.attributes.Ambience &&
          Object.keys(a.attributes.Ambience).includes(ambience) &&
          a.attributes.Ambience[ambience]
        )
          return true;
        return false;
      })
    );
  }

  private bestWhatever(choice: string): Business | undefined {
    const tieStarMax = this.getMaxValue("stars");
    const tieReviewMax = this.getMaxValue("review_count");

    const maxStarBusiness = this.getMaxBusiness("stars", tieStarMax);
    const mostReviewOfMostStar = this.getMostReviewORStar(maxStarBusiness, "review_count");

    const maxReviewBusiness = this.getMaxBusiness("review_count", tieReviewMax);
    const mostStarOfMostReview = this.getMostReviewORStar(maxReviewBusiness, "stars");

    if (choice === "bestPlace") {
      return maxStarBusiness.find(x => x.review_count === mostReviewOfMostStar);
    } else if (choice === "mostReviews") {
      return maxReviewBusiness.find(x => x.stars === mostStarOfMostReview);
    }
    return undefined;
  }

  private getMaxValue(property: "stars" | "review_count"): number {
    return this.data.reduce((acc, e) => {
      if (e[property] !== undefined && e[property]! >= acc) {
        acc = e[property]!;
      }
      return acc;
    }, Number.MIN_VALUE);
  }

  private getMaxBusiness(property: "stars" | "review_count", maxValue: number): Business[] {
    return this.data.filter(a => a[property] === maxValue && a[property] !== undefined);
  }

  private getMostReviewORStar(businesses: Business[], property: "stars" | "review_count"): number {
    return businesses.reduce((acc, e) => {
      if (e[property] !== undefined && e[property]! >= acc) {
        acc = e[property]!;
      }
      return acc;
    }, Number.MIN_VALUE);
  }

  bestPlace(): Business | undefined {
    // TODO
    return this.bestWhatever("bestPlace");
  }

  mostReviews(): Business | undefined {
    // TODO
    return this.bestWhatever("mostReviews");
  }
}
