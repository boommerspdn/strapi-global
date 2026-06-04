import { randomUUID } from "crypto";

export default {
  beforeCreate(event) {
    event.params.data.slug = randomUUID();
  },
};
