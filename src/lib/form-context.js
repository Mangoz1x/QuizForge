"use client";

import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from "react";
import { createEmptyForm } from "@/lib/form-schema";
import { saveQuiz, getQuizExport, updateQuizExport } from "@/lib/storage";
import { clearFiles } from "@/lib/file-storage";

const FormContext = createContext(null);

const initialState = {
  form: createEmptyForm(),
  messages: [], // { role: "user" | "assistant", content: string, form?: object }
  streaming: false,
  streamingMessage: "",
  highlightedQuestions: [],
  pendingQuestions: [], // IDs of questions being modified by AI during streaming
  error: null,
  googleConnected: false,
  formHistory: [], // { form, timestamp, label }
  exportedFormId: null,
  exportedFormUrl: null,
  syncStatus: "idle", // idle | syncing | synced | error
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FORM":
      return { ...state, form: action.payload };
    case "UPDATE_FORM_HEADER":
      return { ...state, form: { ...state.form, ...action.payload } };
    case "UPDATE_QUESTION": {
      const questions = state.form.questions.map((q) =>
        q.id === action.payload.id ? { ...q, ...action.payload.updates } : q
      );
      return { ...state, form: { ...state.form, questions } };
    }
    case "DELETE_QUESTION": {
      const questions = state.form.questions.filter(
        (q) => q.id !== action.payload
      );
      return { ...state, form: { ...state.form, questions } };
    }
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages.slice(-19), action.payload],
      };
    case "SET_STREAMING":
      return { ...state, streaming: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_STREAMING_MESSAGE":
      return { ...state, streamingMessage: action.payload };
    case "APPEND_QUESTION": {
      const exists = state.form.questions.some((q) => q.id === action.payload.id);
      if (exists) return state;
      return {
        ...state,
        form: {
          ...state.form,
          questions: [...state.form.questions, action.payload],
        },
      };
    }
    case "HIGHLIGHT_QUESTIONS":
      return { ...state, highlightedQuestions: action.payload };
    case "CLEAR_HIGHLIGHTS":
      return { ...state, highlightedQuestions: [] };
    case "SET_PENDING_QUESTIONS":
      return { ...state, pendingQuestions: action.payload };
    case "CLEAR_PENDING":
      return { ...state, pendingQuestions: [] };
    case "CHANGE_QUESTION_TYPE": {
      const { id, newType } = action.payload;
      const questions = state.form.questions.map((q) => {
        if (q.id !== id) return q;
        // Save current type-specific data
        const typeData = { ...(q._typeData || {}) };
        typeData[q.type] = {
          options: q.options,
          correctAnswers: q.correctAnswers,
        };
        // Restore saved data for the new type, or create fresh defaults
        const saved = typeData[newType];
        const isChoice = ["multiple_choice", "checkboxes", "dropdown"].includes(newType);
        return {
          ...q,
          type: newType,
          options: isChoice
            ? saved?.options || [
                { id: `o_${Date.now()}_1`, text: "Option 1" },
                { id: `o_${Date.now()}_2`, text: "Option 2" },
              ]
            : undefined,
          correctAnswers: saved?.correctAnswers || [],
          _typeData: typeData,
        };
      });
      return { ...state, form: { ...state.form, questions } };
    }
    case "PUSH_HISTORY": {
      const entry = {
        form: structuredClone(state.form),
        timestamp: Date.now(),
        label: action.payload || `Version ${state.formHistory.length + 1}`,
      };
      return {
        ...state,
        formHistory: [...state.formHistory, entry].slice(-20),
      };
    }
    case "RESTORE_VERSION":
      return {
        ...state,
        form: structuredClone(state.formHistory[action.payload].form),
      };
    case "SET_GOOGLE_CONNECTED":
      return { ...state, googleConnected: action.payload };
    case "SET_EXPORT_INFO":
      return {
        ...state,
        exportedFormId: action.payload.exportedFormId,
        exportedFormUrl: action.payload.exportedFormUrl,
        syncStatus: "synced",
      };
    case "SET_SYNC_STATUS":
      return { ...state, syncStatus: action.payload };
    default:
      return state;
  }
}

function buildInitialState(initialData) {
  if (!initialData) return initialState;
  return {
    ...initialState,
    form: initialData.form || createEmptyForm(),
    messages: initialData.messages || [],
  };
}

export function FormProvider({ children, quizId, initialData }) {
  const [state, dispatch] = useReducer(reducer, initialData, buildInitialState);
  const saveTimerRef = useRef(null);

  // Auto-save to localStorage on form or messages changes
  useEffect(() => {
    if (!quizId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveQuiz(quizId, { form: state.form, messages: state.messages });
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [quizId, state.form, state.messages]);

  const setForm = useCallback(
    (form) => dispatch({ type: "SET_FORM", payload: form }),
    []
  );
  const updateFormHeader = useCallback(
    (updates) => dispatch({ type: "UPDATE_FORM_HEADER", payload: updates }),
    []
  );
  const updateQuestion = useCallback(
    (id, updates) =>
      dispatch({ type: "UPDATE_QUESTION", payload: { id, updates } }),
    []
  );
  const deleteQuestion = useCallback(
    (id) => dispatch({ type: "DELETE_QUESTION", payload: id }),
    []
  );
  const addMessage = useCallback(
    (message) => dispatch({ type: "ADD_MESSAGE", payload: message }),
    []
  );
  const setStreaming = useCallback(
    (val) => dispatch({ type: "SET_STREAMING", payload: val }),
    []
  );
  const setError = useCallback(
    (err) => dispatch({ type: "SET_ERROR", payload: err }),
    []
  );
  const setStreamingMessage = useCallback(
    (msg) => dispatch({ type: "SET_STREAMING_MESSAGE", payload: msg }),
    []
  );
  const appendQuestion = useCallback(
    (q) => dispatch({ type: "APPEND_QUESTION", payload: q }),
    []
  );
  const highlightQuestions = useCallback(
    (ids) => dispatch({ type: "HIGHLIGHT_QUESTIONS", payload: ids }),
    []
  );
  const clearHighlights = useCallback(
    () => dispatch({ type: "CLEAR_HIGHLIGHTS" }),
    []
  );
  const setPendingQuestions = useCallback(
    (ids) => dispatch({ type: "SET_PENDING_QUESTIONS", payload: ids }),
    []
  );
  const clearPending = useCallback(
    () => dispatch({ type: "CLEAR_PENDING" }),
    []
  );
  const changeQuestionType = useCallback(
    (id, newType) =>
      dispatch({ type: "CHANGE_QUESTION_TYPE", payload: { id, newType } }),
    []
  );
  const pushHistory = useCallback(
    (label) => dispatch({ type: "PUSH_HISTORY", payload: label }),
    []
  );
  const restoreVersion = useCallback(
    (index) => dispatch({ type: "RESTORE_VERSION", payload: index }),
    []
  );
  const setGoogleConnected = useCallback(
    (val) => dispatch({ type: "SET_GOOGLE_CONNECTED", payload: val }),
    []
  );
  const setExportInfo = useCallback(
    ({ exportedFormId, exportedFormUrl }) => {
      dispatch({ type: "SET_EXPORT_INFO", payload: { exportedFormId, exportedFormUrl } });
      if (quizId) {
        updateQuizExport(quizId, { exportedFormId, exportedFormUrl });
      }
    },
    [quizId]
  );
  const setSyncStatus = useCallback(
    (status) => dispatch({ type: "SET_SYNC_STATUS", payload: status }),
    []
  );

  // Load export info from localStorage on mount
  useEffect(() => {
    if (!quizId) return;
    const exportData = getQuizExport(quizId);
    if (exportData) {
      dispatch({ type: "SET_EXPORT_INFO", payload: exportData });
    }
  }, [quizId]);

  // Auto-sync to Google Forms when form changes and already exported
  const syncTimerRef = useRef(null);
  const prevFormRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Skip initial mount — only sync on actual changes
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      prevFormRef.current = state.form;
      return;
    }

    if (!state.exportedFormId || state.streaming) return;

    // Skip if form hasn't actually changed (reference check)
    if (prevFormRef.current === state.form) return;
    prevFormRef.current = state.form;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);

    syncTimerRef.current = setTimeout(async () => {
      if (!state.form.questions || state.form.questions.length === 0) return;

      dispatch({ type: "SET_SYNC_STATUS", payload: "syncing" });

      try {
        const res = await fetch("/api/google/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            form: state.form,
            mode: "update",
            formId: state.exportedFormId,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 401) {
            dispatch({ type: "SET_GOOGLE_CONNECTED", payload: false });
          }
          throw new Error(data.error || "Sync failed");
        }

        dispatch({ type: "SET_SYNC_STATUS", payload: "synced" });
      } catch {
        dispatch({ type: "SET_SYNC_STATUS", payload: "error" });
      }
    }, 2000);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [state.form, state.exportedFormId, state.streaming]);

  // Clean up IndexedDB files when leaving the editor
  useEffect(() => {
    return () => {
      clearFiles().catch(() => {});
    };
  }, []);

  const value = {
    ...state,
    setForm,
    updateFormHeader,
    updateQuestion,
    deleteQuestion,
    addMessage,
    setStreaming,
    setStreamingMessage,
    appendQuestion,
    highlightQuestions,
    clearHighlights,
    setError,
    setPendingQuestions,
    clearPending,
    changeQuestionType,
    pushHistory,
    restoreVersion,
    setGoogleConnected,
    setExportInfo,
    setSyncStatus,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
