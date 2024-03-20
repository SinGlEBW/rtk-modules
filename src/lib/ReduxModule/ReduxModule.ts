import { ConfigureStoreOptions, Reducer, configureStore } from '@reduxjs/toolkit';


export class ReduxModule<DeclareRootState> {
  private configStore: ConfigureStoreOptions;
  // private store = {};
 
  constructor(configureStore: ConfigureStoreOptions) {
    this.configStore = configureStore;
  }

  setReducer<R>(dataReducer: {name: string, reduce:Reducer<R> } ) {
    //INFO: Возможно для динамического подключения store нужно пересоздавать store используя renderStore
    return (this.configStore.reducer = { ...this.getReducers(), [dataReducer.name]: dataReducer.reduce });
  }
  getStore() {
    return this.renderStore();
  }
  getState() {
    return this.getStore().getState();
  }

  createSelectors<T extends {[key in keyof T]: (rootState: DeclareRootState) => any}> (selectors:T)  {
    return selectors
  }

  private getReducers() {
    return this.configStore.reducer;
  }

  private getConfigureStore() {
    return this.configStore;
  }

  private renderStore() {
    const store = configureStore(this.getConfigureStore());
    // this.store = store;
    // window.__store__ = store;
    return store;
  }
}
