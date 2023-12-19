import assert from "assert";
import { Business, loadYelpData } from "../include/data.js";
import { FluentBusinesses } from "./FluentBusinesses";

const testData: Business[] = [
  {
    business_id: "abcd",
    name: "Applebee's",
    city: "Charlotte",
    state: "NC",
    stars: 4,
    review_count: 6,
    attributes: {
      Ambience: { Marketing: true },
    },
  },
  {
    business_id: "abcd",
    name: "China Garden",
    state: "NC",
    city: "Charlotte",
    stars: 4,
    review_count: 10,
    attributes: {
      Ambience: { Marketing: true, BusinessOperation: false },
    },
  },
  {
    business_id: "abcd",
    name: "Beach Ventures Roofing",
    state: "AZ",
    city: "Phoenix",
    stars: 3,
    review_count: 30,
  },
  {
    business_id: "abcd",
    name: "Alpaul Automobile Wash",
    city: "Charlotte",
    state: "NC",
    stars: 3,
    review_count: 30,
  },
  {
    business_id: "cdef",
    name: "Cristiano Romero Angile",
    city: "Amherst",
    state: "MA",
    stars: 3,
    categories: ["Macma", "Tornado"],
    hours: {
      Tuesday: "8:0-18:30",
      Thursday: "8:0-18:30",
      Friday: "8:0-18:30",
      Saturday: "8:0-14:0",
    },
  },
  {
    business_id: "efcd",
    name: "Cristiano Linon",
    city: "Boston",
    state: "MA",
    stars: 9,
    review_count: 25,
    categories: ["Tsunami", "Tornado"],
    hours: {
      Monday: "0:0-0:0",
      Tuesday: "8:0-18:30",
      Thursday: "8:0-18:30",
      Saturday: "8:0-14:0",
    },
  },
];

describe("bestPlace", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").getData();

    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Alpaul Automobile Wash");
  });
});

describe("bestPlace", () => {
  it("break tie with review count", () => {
    const best = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").bestPlace();

    assert(best);
    assert(best.name === "China Garden");
  });
});

describe("inCategory", () => {
  it("should correctly filter Macma", () => {
    const list = new FluentBusinesses(testData).inCategory("Macma").getData();

    assert(list.length === 1);
    assert(list[0].business_id === "cdef");
  });
  it("should return undefined if no category matched", () => {
    const list = new FluentBusinesses(testData).inCategory("Ice").getData();
    assert(list.length === 0);
    assert(list[0] === undefined);
  });
  it("should return Businesses with same category", () => {
    const list = new FluentBusinesses(testData).inCategory("Tornado").getData();
    assert(list.length === 2);
    assert(list[0].name === "Cristiano Romero Angile");
    assert(list[1].name === "Cristiano Linon");
  });
});

describe("HasHoursOnDays", () => {
  it("should correctly filter all hours appears in all days", () => {
    const days = ["Monday", "Tuesday", "Thursday"];
    const list = new FluentBusinesses(testData).hasHoursOnDays(days).getData();
    assert(list.length === 1);
    assert(list[0].name === "Cristiano Linon");
  });
  it("should return empty if no timeline matched", () => {
    const days = ["Wednesday", "Sunday"];
    const list = new FluentBusinesses(testData).hasHoursOnDays(days).getData();
    assert(list.length === 0);
    assert(list[0] === undefined);
  });
});

describe("HasAmbience", () => {
  it("should correctly filter hasAmbience", () => {
    const list = new FluentBusinesses(testData).hasAmbience("Marketing").getData();
    assert(list.length === 2);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });
  it("should correctly return empty", () => {
    const list = new FluentBusinesses(testData).hasAmbience("BusinessOperation").getData();
    assert(list.length === 0);
    assert(list[0] === undefined);
  });
});

describe("mostReview", () => {
  it("check tie max review_count and return the first max stars", () => {
    const best = new FluentBusinesses(testData).mostReviews();
    assert(best);
    assert(best.name === "Beach Ventures Roofing");
  });
  it("should return undefined when no property found", () => {
    const best = new FluentBusinesses(testData).fromCityInState("Amherst", "MA").mostReviews();
    assert(best === undefined);
  });
});

describe("hasStarsGeq", () => {
  it("should return empty array because of very large number ofstars", () => {
    const list = new FluentBusinesses(testData).hasStarsGeq(100).getData();
    assert(list.length === 0);
    assert(list[0] === undefined);
  });
  it("should correctly filter stars", () => {
    const list = new FluentBusinesses(testData).hasStarsGeq(4).getData();
    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Cristiano Linon");
  });
});

describe("fromCityInState", () => {
  it("should correctly filter city and state", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").getData();
    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Alpaul Automobile Wash");
  });
  it("should retrun empty array", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Holyoke", "MA").getData();
    assert(list.length === 0);
    assert(list[0] === undefined);
  });
});
