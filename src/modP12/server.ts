import * as express from 'express';
import {spawn} from 'child_process';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/execmd', (req, res) => {
  const command = req.query.cmd?{cmd: req.query.cmd.toString()}:{};
  const argss = req.query.args?{args: req.query.args.toString()}:{};
  if ('cmd' in command) {
    const myPromise = new Promise<any>((resolve, reject) => {
      console.log(argss.args);
      const requestedProcess = spawn(command.cmd as string, argss.args? argss.args.split(' ') as string[] : ['']);
      let errmsg: string = '';
      requestedProcess.on('error', function(err) {
        errmsg = err.message;
        reject(errmsg);
      });
      let commandOutput: string = '';
      let errOutput = '';
      let terminatedProperly = false;
      requestedProcess.stderr.on('data', (piece) => {
        errOutput += piece;
        terminatedProperly = false;
      });
      requestedProcess.stdout.on('data', (piece) => {
        commandOutput += piece;
        terminatedProperly = true;
      });
      requestedProcess.on('close', () =>{
        console.log('Sending response....\n');
        if (errOutput == '') {
          const response = {'cmd': command.cmd, 'args': argss.args, 'success': terminatedProperly, 'output': commandOutput};
          console.log(`Response: \n`+ JSON.stringify(response, null, 4));
          resolve(response);
        } else {
          const response = {'cmd': command.cmd, 'args': argss.args,'success': terminatedProperly, 'output': errOutput};
          console.log(`Response: \n` + JSON.stringify(response, null, 4));
          resolve(response);
        }
      });
    });
    myPromise.then((response) => {
      res.status(200).send(JSON.stringify(response));
    }).catch((error) => {
      const response = {'cmd': command.cmd, 'args': argss.args, 'success': false, 'output': 'Bad command', 'err': error};
      console.log(`Response: \n`+ JSON.stringify(response, null, 4));
      res.status(200).send(JSON.stringify(response));
    });
  } else {
    res.status(404).send('Command not provided, try again');
  }
});

app.all('*', (_, res) => {
  res.status(404).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});