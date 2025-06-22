import axios from "axios";
import { create } from "zustand";

const useApp = create<any>((set) => ({
  user: null,
  fetchUser: async () => {
    const res = await axios.get("/api/login");
    if (res.status === 200) {
      set({ user: res.data });
    } else {
      set({ user: null });
    }
  },
}));

export default useApp;
