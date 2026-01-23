export interface IncomingEmailFrom {
  name: string;
  address: string;
}

export interface IncomingEmail {
  id: string;
  from: {
    text: string;
    addresses: IncomingEmailFrom[];
  };
  subject: string;
  text: string;
  timestamp: number;
  threadId: string;
  threadPosition: number;
}

export interface SessionInitRequest {
  email: string;
}

export interface SessionInitResponse {
  token: string;
}
