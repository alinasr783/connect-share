import Button from "./Button";

function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6
        h-screen mx-auto text-center text-gray-800">
      <h1 className="text-3xl font-bold">This page could not be found :(</h1>
      <Button to="/" type="primary" size="large">
        Go Home
      </Button>
    </div>
  );
}

export default NotFound;
