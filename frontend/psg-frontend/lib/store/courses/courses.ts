import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CursosServices from "@/services/cursosServices";
import MetaInterface from "@/models/meta.interface";

interface CoursesState {
  items: any[];
  categories: any[];
  selectedCourse: any | null;
  meta: MetaInterface | null;
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  items: [],
  categories: [],
  selectedCourse: null,
  meta: null,
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  "courses/fetchFiltered",
  async (params: any) => {
    const response = await CursosServices.filteredCourses(params);
    return response;
  }
);

export const fetchCategories = createAsyncThunk(
  "courses/fetchCategories",
  async () => {
    const response = await CursosServices.getAllCategories();
    return response.items || [];
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (id: string) => {
    const response = await CursosServices.findById(id);
    return response;
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.meta = action.payload.meta;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch courses";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch course details";
      });
  },
});

export default coursesSlice.reducer;
