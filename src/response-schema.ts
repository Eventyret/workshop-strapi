/**
 * Mandatory response action.
 * Should briefly explain the proposed changes, ask for more information
 * and challenge the proposed schema (if any).
 */
type TextResponse = {
  type: "text";
  content: string;
};

/**
 * Content type response action.
 * Proposed as soon there is minimal information to create a content type.
 */
type ContentTypeResponse = {
  type: "content-type";
  content: {
    attributes: {
      [key: string]: {
        type: string;
      };
    };
  };
};

type Response = TextResponse | ContentTypeResponse;

export type LLMResponse = {
  actions: Response[];
};
