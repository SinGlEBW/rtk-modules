

```js  
//store.ts
import { setupListeners } from '@reduxjs/toolkit/query';
import { ReduxModule } from 'rtk-module';

export const moduleStore = new ReduxModule<RootState>({
  reducer: {
    app: AppReduce,
    socket: SocketReduce,
    request: RequestReduce,
    settings: SettingsSlice.reducer,
    [requestSocketApi.reducerPath]: requestSocketApi.reducer,
    [requestHTTPSApi.reducerPath]: requestHTTPSApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(requestSocketApi.middleware).concat(requestHTTPSApi.middleware),
});


setupListeners(moduleStore.getStore().dispatch);
```

```js  
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { Provider } from 'react-redux';
import { moduleStore } from './store/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={moduleStore.getStore()}>
    <App/>
  </Provider>
)
```

### Connected module

>Profile/<br>
>&emsp;store/<br>
>&emsp;&emsp;types.d.ts<br>
>&emsp;&emsp;profile.store.ts<br>
>&emsp;Profile.tsx<br>

```js 
//Profile/store/types.d.ts
export type ProfileKey_OR =  'name' | 'fio' | 'phone' | 'avatar';
export interface ProfileState extends Record<ProfileKey_OR, string>{

}

declare global {
  interface RootState{
    profile: ProfileState
  }
}
```

```js 
//Profile/store/profile.store.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { moduleStore } from "@/store/store";
import { ProfileState } from "./types";

const initialState: ProfileState = {
  name: "Вася",
  fio: "Пупкин",
  phone: "",
  avatar: "",
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setName: (profile, { payload }: PayloadAction<{ name: string }>) => {
      profile.name = payload.name;
    },
  },
});

moduleStore.setReducer({
  name: ProfileSlice.name,
  reduce: ProfileSlice.reducer,
});

export const ProfileSelectors = moduleStore.createSelectors({
  getProfile: (rootState) => {
    return rootState.profile;
  },
  getName: (rootState) => {
    return rootState.profile.name;
  },
});

export const ProfileActions = ProfileSlice.actions;
```


```js 
//Profile/Profile.tsx
import React, { useEffect } from "react"
import { ProfileSelectors,ProfileActions } from './store/profile.store';
import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooksRedux';


const ProfileMemo = (props) => {
  const dispatch = useAppDispatch();
  const name = useAppSelector(ProfileSelectors.getName);
  
  return (
    <div>
      <h2>Привет, {name}</h2>
      <Button onClick={() => dispatch(ProfileActions.setName({name: 'Петя'}))}>Сменить имя</Button>
    </div>
  )
};

export const Profile = React.memo(ProfileMemo);
```