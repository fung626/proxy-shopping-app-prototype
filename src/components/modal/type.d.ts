export type ModalParam =
  | { action: "REDIRECT"; path: string }
  | { action: "CLOSE" }
  | { action: "CONFIRM"; payload?: any };

export type CloseModalHandler = (param?: ModalParam) => void;
