import { fetchData, flattenTracks } from "./script";

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
