'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (contract) {
  return JSON.parse(contract.abi).map(function (method) {
    // get find relevent docs
    var inputParams = method.inputs || [];
    var signature = method.name && method.name + '(' + inputParams.map(function (i) {
      return i.type;
    }).join(',') + ')';
    var devDocs = ((JSON.parse(contract.devdoc) || {}).methods || {})[signature] || {};
    var userDocs = ((JSON.parse(contract.userdoc) || {}).methods || {})[signature] || {};
    // map abi inputs to devdoc inputs
    var params = devDocs.params || {};
    var inputs = inputParams.map(function (param) {
      return _extends({}, param, { description: params[param.name] });
    });
    // don't write this
    delete devDocs.params;

    // START HACK workaround pending https://github.com/ethereum/solidity/issues/1277
    // TODO map outputs properly once compiler splits them out
    // in the meantime, use json array
    // parse devDocs.return as a json object
    var outputs = void 0;
    try {
      (function () {
        var outputParams = JSON.parse(devDocs.return);
        outputs = method.outputs.map(function (param) {
          return _extends({}, param, { description: outputParams[param.name] });
        });
      })();
    } catch (e) {
      outputs = method.outputs;
    }
    // END HACK

    return _extends({}, method, devDocs, userDocs, {
      inputs: inputs,
      outputs: outputs,
      signature: signature,
      signatureHash: signature && (0, _helpers.getFunctionSignature)(signature)
    });
  });
};

var _helpers = require('../helpers');