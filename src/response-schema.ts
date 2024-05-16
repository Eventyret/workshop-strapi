type TextResponse = {
  type: "text";
  content: string;
};

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

// export type LLMResponse = (TextResponse | ContentTypeResponse)[];
export type LLMResponse = ContentTypeResponse;
