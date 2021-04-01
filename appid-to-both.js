const algosdk = require('algosdk');
const fsp = require('fs').promises;
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readline = require('readline');

// define the application to search for
const appID=181541402;

// define the algod connection
// const algodToken = "241aa58eedb0c1dacff2199372798ddcb5bb968cfd56f6cc486b8e29bb14c3c6";
// const algodServer = "http://localhost";
// const algodPort = 6001;

const algodToken = "735f46d7fe8f09fdbbc85253e7a0c8705f02c254593ab3a8bc4dd46097e927be";
const algodServer = "http://localhost";
const algodPort = 8080;

const version="// version";
const intcblock="intcblock";
const bytecblock="bytecblock";

let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// parses the approval program from the the application id provided. Returns the base64 program.
async function getProgram(type, id) {
    let response = await algodClient.getApplicationByID(id).do();
    program = JSON.stringify(response['params'][type], undefined, 2);
    console.log(program);    
    return program.slice(1, -1);
}

// writes a compiled binary file based on the base64 program.
async function writeBinary(type, programB64) {
    try {
        await fsp.writeFile(appID + '-' + type + '.teal.tok', programB64, 'base64');
        console.log("Wrote binary file: " + appID + '-' + type + ".teal.tok")
    }   catch (error) {
        console.log(error)
    }
}

// writes a source file with proper values. Reads the packed file and swaps values from packed arrays.
async function writeSource(type, ver, ints, bytes) {
    var source = "";
    var index = undefined;
    // read packed file line by line
    const fileStream = fs.createReadStream(appID + '-' + type + '.teal.pack');
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });  

    // swap packed values into source
    for await (const line of rl) {
        if (line.startsWith(version)) {
            source = source + "#pragma version " + ver[ver.length-1] + "\n"; 
        }
        else if (line.startsWith(intcblock) || line.startsWith(bytecblock)) {
            source = source + "// " + line + "\n";
        }
        else if (line.startsWith("intc")) {
            index = parseInt(line.slice(5), 10) + 1;
            source = source + "int " + ints[index] + "\n";
        }
        else if (line.startsWith("bytec")) { 
            index = parseInt(line.slice(6), 10) + 1;
            source = source + "byte \"" + hex2a(bytes[index]) + "\"\n";
        }
        else {
            source = source + line + "\n";
        }
    }
    // write source file
    try {
        await fsp.writeFile(appID + '-' + type + '.teal', source);
        console.log("Wrote source file: " + appID + '-' + type + ".teal")
    }   catch (error) {
        console.log(error)
    }
}

// calls goal to decompile the binary into the packed file. goal must be in $PATH
async function decompileBinary(type) {
    try {
        const { stdout, stderr } = await exec('goal clerk compile -D ' + appID + '-' + type + '.teal.tok > ' + appID + '-' + type + '.teal.pack');
        console.log("Wrote decompiled file: "  + appID + '-' + type + ".teal.pack");
    }catch (err) {
       console.error(err);
    };
};

// parses the packed file to find the requested data and returns an array.
async function parserFind(type, value) {
    const fileStream = fs.createReadStream(appID + '-' + type + '.teal.pack'); 
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });  
    for await (const line of rl) {
        if (line.startsWith(value)) {
            // console.log("Found %s", value)
            var parsedData = line.split(" ");
            // console.log(parsedData)
            fs.close;
            return parsedData;
        }
    }
}

// helper to convert hex to ascii
function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var v = parseInt(hex.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
}  

 async function main() {
    // get program (base64)
    const approvalProgramB64 = await getProgram('approval-program',appID);
    const clearProgramB64 = await getProgram('clear-state-program',appID);

    // write to binary file
    await writeBinary('approval-program', approvalProgramB64);
    await writeBinary('clear-state-program', clearProgramB64);

    // decompile to packed source
    await decompileBinary('approval-program');
    await decompileBinary('clear-state-program');

    // parse the packed file
    const approvalPragmaVersion = await parserFind('approval-program', version);
    const approvalIntCBlock = await parserFind('approval-program', intcblock);
    const approvalByteCBlock = await parserFind('approval-program', bytecblock);
    const clearPragmaVersion = await parserFind('clear-state-program', version);
    const clearIntCBlock = await parserFind('clear-state-program', intcblock);
    const clearByteCBlock = await parserFind('clear-state-program', bytecblock);

    // write source file 
    writeSource('approval-program', approvalPragmaVersion, approvalIntCBlock, approvalByteCBlock)
    writeSource('clear-state-program', clearPragmaVersion, clearIntCBlock, clearByteCBlock)

}

main();
