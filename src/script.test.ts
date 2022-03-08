import {
  fetchData,
  flattenTracks,
  getTooltip,
  getTotalPlayCount,
  groupTracksByDate,
  sortTracks,
  TrackPlayCountWithDate,
} from "./script";

describe("flatten tracks", () => {
  const data = fetchData();
  const flattenData = [
    { timestp: "2021-04-08", trackName: "Peaches" },
    { timestp: "2021-04-09", trackName: "Savage" },
    { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
    { timestp: "2021-04-08", trackName: "Savage" },
    { timestp: "2021-04-08", trackName: "Savage" },
    { timestp: "2021-04-08", trackName: "Savage" },
    { timestp: "2021-04-09", trackName: "Captain Hook" },
    { timestp: "2021-04-08", trackName: "Captain Hook" },
    { timestp: "2021-04-07", trackName: "Captain Hook" },
  ];

  test.each([
    ["empty array", [], []],
    ["test data", data, flattenData],
    ["single input", [data[0]], [flattenData[0]]],
    ["partial test data (1)", data.slice(1), flattenData.slice(1)],
    ["partial test data (2)", data.slice(1, 2), flattenData.slice(1, 6)],
  ])("returns expected result (%s)", (_string, input, expected) => {
    const result = flattenTracks(input);
    expect(result).toEqual(expected);
  });
});

describe("sort tracks", () => {
  const tracks = flattenTracks(fetchData());
  const sortedTracks = [
    { timestp: "2021-04-07", trackName: "Captain Hook" },
    { timestp: "2021-04-08", trackName: "Peaches" },
    { timestp: "2021-04-08", trackName: "Savage" },
    { timestp: "2021-04-08", trackName: "Savage" },
    { timestp: "2021-04-08", trackName: "Savage" },
    { timestp: "2021-04-08", trackName: "Captain Hook" },
    { timestp: "2021-04-09", trackName: "Savage" },
    { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
    { timestp: "2021-04-09", trackName: "Captain Hook" },
  ];

  const sortedDummyTracks = [
    { timestp: "2000-01-01", trackName: "first" },
    { timestp: "2000-01-02", trackName: "second" },
    { timestp: "2000-01-03", trackName: "third" },
    { timestp: "2000-01-04", trackName: "fourth" },
  ];
  const dummyTracks = sortedDummyTracks.slice();
  const reversedDummyTracks = dummyTracks.reverse();

  const repeatedDateTracks = [
    { timestp: "2000-01-02", trackName: "third" },
    { timestp: "2000-01-02", trackName: "fourth" },
    { timestp: "2000-01-01", trackName: "first" },
    { timestp: "2000-01-01", trackName: "second" },
  ];

  const repeatedDateSortedTracks = [
    { timestp: "2000-01-01", trackName: "first" },
    { timestp: "2000-01-01", trackName: "second" },
    { timestp: "2000-01-02", trackName: "third" },
    { timestp: "2000-01-02", trackName: "fourth" },
  ];

  beforeEach(() => dummyTracks.sort(() => Math.random() - 0.5));

  test.each([
    ["test data", tracks, sortedTracks],
    ["dummy data (1)", dummyTracks, sortedDummyTracks],
    ["dummy data (2)", dummyTracks, sortedDummyTracks],
    ["dummy data (3)", dummyTracks, sortedDummyTracks],
    ["dummy data (reversed)", reversedDummyTracks, sortedDummyTracks],
    ["repeated date data", repeatedDateTracks, repeatedDateSortedTracks],
  ])("returns expected result (%s)", (_string, input, expected) => {
    const result = sortTracks(input);
    expect(result).toEqual(expected);
  });
});

describe("group tracks by date", () => {
  const data = sortTracks(flattenTracks(fetchData()));
  const tracksByDate = [
    { timestp: "2021-04-07", trackPlayCount: { "Captain Hook": 1 } },
    {
      timestp: "2021-04-08",
      trackPlayCount: { Peaches: 1, Savage: 3, "Captain Hook": 1 },
    },
    {
      timestp: "2021-04-09",
      trackPlayCount: {
        Savage: 1,
        "Savage (feat. Beyonce)": 1,
        "Captain Hook": 1,
      },
    },
  ];

  const dummyData = [
    { timestp: "2000-01-01", trackName: "a" },
    { timestp: "2000-01-01", trackName: "a" },
    { timestp: "2000-01-01", trackName: "a" },
    { timestp: "2000-01-01", trackName: "a" },
    { timestp: "2000-01-01", trackName: "a" },
    { timestp: "2000-01-01", trackName: "a" },
  ];
  const dummyGroupByDate = [
    { timestp: "2000-01-01", trackPlayCount: { a: 6 } },
  ];

  const dummyDataTwo = [
    { timestp: "2000-01-01", trackName: "a" },
    { timestp: "2000-01-01", trackName: "a" },
    { timestp: "2000-01-01", trackName: "b" },
    { timestp: "2000-01-01", trackName: "b" },
    { timestp: "2000-01-01", trackName: "c" },
    { timestp: "2000-01-01", trackName: "c" },
  ];
  const dummyGroupByDateTwo = [
    { timestp: "2000-01-01", trackPlayCount: { a: 2, b: 2, c: 2 } },
  ];

  const dummyDataThree = [
    { timestp: "2000-01-01", trackName: "a" },
    { timestp: "2000-01-01", trackName: "a" },
    { timestp: "2000-01-01", trackName: "b" },
    { timestp: "2000-01-02", trackName: "b" },
    { timestp: "2000-01-02", trackName: "c" },
    { timestp: "2000-01-02", trackName: "c" },
  ];
  const dummyGroupByDateThree = [
    { timestp: "2000-01-01", trackPlayCount: { a: 2, b: 1 } },
    { timestp: "2000-01-02", trackPlayCount: { b: 1, c: 2 } },
  ];

  test.each([
    ["test data", data, tracksByDate],
    ["dummy data (1)", dummyData, dummyGroupByDate],
    ["dummy data (2)", dummyDataTwo, dummyGroupByDateTwo],
    ["dummy data (3)", dummyDataThree, dummyGroupByDateThree],
  ])("returns expected result (%s)", (_string, input, expected) => {
    const result = groupTracksByDate(input);
    expect(result).toEqual(expected);
  });
});

describe("get tooltip", () => {
  const tracksByDate: Array<TrackPlayCountWithDate> = [
    { timestp: "2021-04-07", trackPlayCount: { "Captain Hook": 1 } },
    {
      timestp: "2021-04-08",
      trackPlayCount: { Peaches: 1, Savage: 3, "Captain Hook": 1 },
    },
    {
      timestp: "2021-04-09",
      trackPlayCount: {
        Savage: 1,
        "Savage (feat. Beyonce)": 1,
        "Captain Hook": 1,
      },
    },
  ];

  const firstTooltip = "Captain Hook (1)";
  const secondTooltip = "Peaches (1), Savage (3), Captain Hook (1)";
  const thirdTooltip =
    "Savage (1), Savage (feat. Beyonce) (1), Captain Hook (1)";

  test.each([
    ["test data (1)", tracksByDate[0].trackPlayCount, firstTooltip],
    ["test data (2)", tracksByDate[1].trackPlayCount, secondTooltip],
    ["test data (3)", tracksByDate[2].trackPlayCount, thirdTooltip],
  ])("returns expected result (%s)", (_string, input, expected) => {
    const result = getTooltip(input);
    expect(result).toEqual(expected);
  });
});

describe("get total play count", () => {
  const tracksByDate: Array<TrackPlayCountWithDate> = [
    { timestp: "2021-04-07", trackPlayCount: { "Captain Hook": 100 } },
    {
      timestp: "2021-04-08",
      trackPlayCount: { Peaches: 10, Savage: 20, "Captain Hook": 30 },
    },
    {
      timestp: "2021-04-09",
      trackPlayCount: {
        Savage: 0,
        "Savage (feat. Beyonce)": 0,
        "Captain Hook": 0,
      },
    },
  ];

  const firstTotalCount = 100;
  const secondTotalCount = 60;
  const thirdTotalCount = 0;

  test.each([
    ["test data (1)", tracksByDate[0].trackPlayCount, firstTotalCount],
    ["test data (2)", tracksByDate[1].trackPlayCount, secondTotalCount],
    ["test data (3)", tracksByDate[2].trackPlayCount, thirdTotalCount],
  ])("returns expected result (%s)", (_string, input, expected) => {
    const result = getTotalPlayCount(input);
    expect(result).toEqual(expected);
  });
});
