const ExtensionBase = {
  methods: () => {},
  statics: () => {},
  query: () => {},
  indexes: () => {},
  virtuals: () => {},
};

const User = {
  methods: () => {},
  statics: () => {},
  query: () => {},
  indexes: () => {},
  virtuals: () => {},
};

const Team = {
  methods: () => {},
  statics: () => {},
  query: () => {},
  indexes: () => {},
  virtuals: () => {},
};

const Division = {
  methods: () => {},
  statics: () => {},
  query: () => {},
  indexes: () => {},
  virtuals: () => {},
};

const League = {
  methods: () => {},
  statics: statics => {
    statics.findByIdOrName = function(idOrName) {
      const query = idOrName.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrName } : { name: idOrName };
      return this.findOne(query);
    };
  },
  query: () => {},
  indexes: () => {},
  virtuals: () => {},
};

const Match = {
  methods: () => {},
  statics: () => {},
  query: () => {},
  indexes: () => {},
  virtuals: () => {},
};

module.exports = { ExtensionBase, User, Team, Division, League, Match };
