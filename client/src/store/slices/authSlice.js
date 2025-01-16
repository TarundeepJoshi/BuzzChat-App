// export const createAuthSlice = (set, get) => ({
//   userInfo: JSON.parse(localStorage.getItem('userInfo')) || undefined,
//   setUserInfo: (userInfo) => {
//     localStorage.setItem('userInfo', JSON.stringify(userInfo));
//     set({ userInfo });
//   },
// });

export const createAuthSlice = (set, get) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo }),
});
