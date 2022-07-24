import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faHeart as faSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegular } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faSolid);
library.add(faRegular);

createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(router)
  .use(createPinia())
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
