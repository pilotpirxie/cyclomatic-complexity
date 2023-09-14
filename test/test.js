function complexFunction(data) {
  let result = [];

  if (data && Array.isArray(data)) {
    data.forEach((item, index) => {
      let processedItem = processItem(item, index);
      if (processedItem) {
        result.push(processedItem);
      }
    });
  } else if (typeof data === "object") {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let processedItem = processItem(data[key], key);
        if (processedItem) {
          result.push(processedItem);
        }
      }
    }
  } else {
    throw new Error("Invalid data type");
  }

  return result;
}

function processItem(item, identifier) {
  if (item == null) {
    return null;
  }

  if (Array.isArray(item)) {
    return item.map((subItem, index) =>
      processItem(subItem, `${identifier}_${index}`),
    );
  }

  if (typeof item === "object") {
    let result = {};
    for (let key in item) {
      if (item.hasOwnProperty(key)) {
        result[key] = processItem(item[key], `${identifier}_${key}`);
      }
    }
    return result;
  }

  return item;
}

try {
  let data = {
    a: [1, 2, [3, 4]],
    b: {
      c: 5,
      d: [6, { e: 7, f: 8 }],
    },
    g: null,
  };

  console.log(complexFunction(data));
} catch (error) {
  console.error(error);
}
