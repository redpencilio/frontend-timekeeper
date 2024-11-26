import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  serializeAttribute(snapshot, json, key, attributes) {
    if (key === 'uri') {
      // don't serialize
    } else if (snapshot.record.isNew || snapshot.changedAttributes()[key]) {
      super.serializeAttribute(snapshot, json, key, attributes);
    } else {
      // don't serialize
    }
  }

  shouldSerializeHasMany(snapshot, key, relationshipType) {
    if (relationshipType.options.serializable === false) {
      return false;
    }
    return super.shouldSerializeHasMany(snapshot, key, relationshipType);
  }

  serializeBelongsTo(snapshot, json, relationship) {
    if (relationship.options.serializable === false) {
      return false;
    }
    return super.serializeBelongsTo(snapshot, json, relationship);
  }
}
