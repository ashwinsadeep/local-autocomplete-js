/**
 * @param {String} value
 * @param {IndexNode} parent
 * @constructor
 */
var IndexNode = function (value, parent) {
    this._value    = value;
    this._parent   = parent;
    this._children = {};
    this._isWord   = false;
};

IndexNode.prototype.addChild = function (value) {
    var node              = new IndexNode(value, this);
    this._children[value] = node;
    return node;
};

IndexNode.prototype.getChild = function (value) {
    return this._children[value];
};

IndexNode.prototype.getChildren = function () {
    return this._children;
};

IndexNode.prototype.setIsWord = function () {
    this._isWord = true;
};

IndexNode.prototype.isWord = function () {
    return this._isWord;
};

IndexNode.prototype.getValue = function () {
    return this._value;
};

var PrefixSearchIndex = function (words) {
    var self   = this;
    self._root = new IndexNode(null, null);
    words      = words || [];
    words.forEach(function (word) {
        self.insert(word);
    });
};

PrefixSearchIndex.prototype.insert = function (string) {
    var node = this._root;
    string.split('').forEach(function (char) {
        if (node.getChild(char)) {
            node = node.getChild(char);
        } else {
            node = node.addChild(char);
        }
    });

    node.setIsWord();
};

PrefixSearchIndex.prototype.search = function (string) {
    var chars = string.split('');
    var node  = this._root;
    var char  = chars.shift();
    while (node && char) {
        node = node.getChild(char);
        char = chars.shift();
    }

    return !!(node && node.isWord());
};

PrefixSearchIndex.prototype.prefixSearch = function (string) {
    var chars = string.split('');
    var node  = this._root;
    var char  = chars.shift();
    while (node && char) {
        node = node.getChild(char);
        char = chars.shift();
    }

    // No words with matching prefix
    if (!node) {
        return [];
    }

    // At this point, all subtrees of the node will be the words with prefix
    return getAllSubtrees(node, string.slice(0, -1));
};

var getAllSubtrees = function (node, prefix) {
    var words    = [];
    var children = Object.keys(node.getChildren());
    if (node.isWord()) {
        words.push(prefix + node.getValue());
    }

    children.forEach(function (char) {
        words = words.concat(getAllSubtrees(node.getChild(char), prefix + node.getValue()));
    });

    return words
};

module.exports = PrefixSearchIndex;