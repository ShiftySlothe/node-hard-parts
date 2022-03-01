const fs = require("fs");
const { pipeline } = require("stream/promises");
const through2 = require("through2");
const through = require("through2");

// const callback = (err, data) => {
//   if (err) throw err;
//   console.log(data);
// };
// /* Create a read stream here
//  */
// const readPoemStream = fs.readFile(
//   "./on-joy-and-sorrow-emoji.txt",
//   {
//     encoding: "utf-8",
//   },
//   callback
// );

// readPoemStream.on("data", (c) => {
//   console.log(c);
// });

const fileReadStream = fs.createReadStream(
  "./on-joy-and-sorrow-emoji.txt",
  "utf-8"
);
const writePoemStream = fs.createWriteStream(
  "./on-joy-and-sorrow-fixed.txt",
  "utf-8"
);

fileReadStream.on("data", (c) => {
  writePoemStream.write(c.replaceAll(":)", "joy").replaceAll(":(", "sorrow"));
});

/* Create a write stream here
 */

/* EXTENSION: Create a transform stream (modify the read stream before piping to write stream)
 */

// async function readWrite() {
//     await pipeline(
//         fs.createReadStream(("./on-joy-and-sorrow-emoji.txt", "utf-9"),
//         async function* (soure, signal) {
//             for await (const c of source) {
//                 yield await c.replaceAll(":)", "joy").replaceAll(":(", "sorrow")
//             },
//         fs.createWriteStream("./on-joy-and-sorrow-emoji2.txt", "utf-8"),
//     )
// }

async function readWrite() {
  await pipeline(
    fs.createReadStream("./on-joy-and-sorrow-emoji.txt"),
    async function* (source, signal) {
        source.setEncoding("utf8"); // Work with strings rather than `Buffer`s.
        for await (const chunk of source) {
            yield await chunk.replaceAll(":)", "joy").replaceAll(":(", "sorrow");
        }
    },
    fs.createWriteStream("pipelinePoem.txt")
  );
  console.log("Pipeline succeeded.");
}

readWrite().catch((e) => console.log(e));
