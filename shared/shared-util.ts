

export const shUtil = {
  isAdminModuleId,
  stringToArray
};

function stringToArray(_str) {
  let str = _str.trim();
  if (str[str.length - 1] === ',') {
    str = str.substr(0, str.length - 1);
  }
  return str ? str.split(',').map(x => x.trim()) : [];
}

function isAdminModuleId(moduleId) {
  return moduleId === 99;
}



