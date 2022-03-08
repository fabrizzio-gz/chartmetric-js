import { fetchData, flattenTracks, sortTracks } from "./script";

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
    ["same date data", repeatedDateTracks, repeatedDateSortedTracks],
  ])("returns expected result (%s)", (_string, input, expected) => {
    const result = sortTracks(input);
    expect(result).toEqual(expected);
  });
});
