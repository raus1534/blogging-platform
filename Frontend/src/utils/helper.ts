import { AxiosError } from "axios";
import DOMPurify from "dompurify";
import dateformat from "dateformat";

export const handleAxiosError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      return error.response.data;
    }
    return { error: error.message };
  }
  return { error: "An unknown error occurred" };
};

export const isValidEmail = (email: string) => {
  // eslint-disable-next-line
  const emailRegularEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegularEx.test(email);
};

export const isValidName = (name: string) => {
  const nameRegularEx = /^[a-z A-Z]+$/;
  return nameRegularEx.test(name);
};

export const sanitizeHTML = (html: string) => {
  return { __html: DOMPurify.sanitize(html) };
};
export const sanitizeHTMLWithP = (html: string) => {
  // Remove all HTML tags using a regular expression
  const sanitizedContent = html.replace(/<[^>]*>?/gm, "");

  // Wrap the sanitized content in <p> tags
  const wrappedContent = `<p>${sanitizedContent}</p>`;

  return { __html: DOMPurify.sanitize(wrappedContent) };
};
export const formatDate = (date: string = new Date().toString()): string => {
  const originalDate = new Date(date);

  const ktmDate = new Date(
    originalDate.toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })
  );

  const formattedDate = dateformat(ktmDate, "mmmm d, yyyy HH:MM 'NPT'");

  return formattedDate;
};
