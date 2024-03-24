const path = require("node:path");
const fs = require("fs");

export function getFilesAndFoldersInDir(dir) {
  const basePath = path.join(process.cwd(), `${dir}`)
  const filesList = [];
  readFile(basePath, basePath, filesList);
  return filesList;
}

export function readFile(basePath, path, filesList) {
  const files = fs.readdirSync(path);
  files.forEach(walk);
  function walk(file) {
    const states = fs.statSync(path + "/" + file);
    if (states.isDirectory()) {
      readFile(basePath, path + "/" + file, filesList);
    } else {
      const obj: any = {};
      obj.size = states.size;
      obj.name = file;
      obj.path = path + "/" + file;
      obj.relativePath = obj.path.replace(basePath, "");
      obj.url = obj.relativePath.replace(".ts", "").replace(".js", "");
      filesList.push(obj);
    }
  }
}
const toString = Object.prototype.toString
export function isObject(obj: any): obj is Object {
  return toString.call(obj) === "[object Object]"
}

export function isFunction(obj: any): obj is Function {
  return toString.call(obj) === "[object Function]"
}
