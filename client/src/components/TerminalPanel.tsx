import XTerminal from "./ui/terminal";

const TerminalPanel: React.FC = () => {
  const initialText = `$ npm start
Starting development server...
Compiled successfully!

You can now view my-project in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.5:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully`;

  return (
    <div className="flex-1 font-mono text-xs">
      <XTerminal initialText={initialText} />
    </div>
  );
};

export default TerminalPanel;
