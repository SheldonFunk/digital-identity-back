import { AppConfig } from "@/models/appConfig";
import { RootState } from "@/models/storeState";
import { configuration } from "@/store/modules/configuration/configuration";
import { connection } from "@/store/modules/connection/connection";
import { credential } from "@/store/modules/credential/credential";
import { invitation } from "@/store/modules/invitation/invitation";
import Vue from "vue";
import Vuex, { Store, StoreOptions } from "vuex";
import { vuexOidcCreateStoreModule } from "vuex-oidc";

class IssuerStore extends Store<RootState> {
  private static instance: Store<RootState>;

  private constructor(config: AppConfig) {
    Vue.use(Vuex);

    const storeOptions: StoreOptions<RootState> = {
      state: {
        version: "1.0.0" // a simple property
      },
      modules: {
        configuration,
        credential,
        invitation,
        connection,
        oidcStore: vuexOidcCreateStoreModule(
          config.authentication.oidcSettings,
          // Optional OIDC store settings
          {
            namespaced: true,
            dispatchEventsOnWindow: true
          }
        )
      }
    };

    super(storeOptions);
  }

  static getInstance(config?: AppConfig): IssuerStore {
    if (!IssuerStore.instance) {
      if (!config) {
        throw new Error(
          "No AppConfig was provided and no IssueStore instance is available"
        );
      }
      IssuerStore.instance = new IssuerStore(config);
    }

    return IssuerStore.instance;
  }
}

export default IssuerStore;
