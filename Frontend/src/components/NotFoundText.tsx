export default function NotFoundText({
  visible,
  text,
}: {
  visible: boolean;
  text: string;
}) {
  if (!visible) return null;
  return (
    <h1 className="py-5 text-3xl font-semibold text-center text-gray-900 dark:text-white opacity-90">
      {text ? text : "Record Not Found"}
    </h1>
  );
}
