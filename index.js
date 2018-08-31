const path = require('path');
const chalk = require('chalk');

function parseStack(errorStack) {
    const re = /^\s*(?:at\s+(?<fnName>[\w\d\-_\.]+))?\s*\(?(?<filePath>[^\:]+):(?<line>\d+):(?<column>\d+)\)?$/gm;
    let match;
    let stack = [];

    while ((match = re.exec(errorStack))) {
        stack.push({
            name: match.groups.fnName,
            filePath: match.groups.filePath,
            fileName:
                match.groups.filePath && path.basename(match.groups.filePath),
            line: parseInt(match.groups.line),
            column: parseInt(match.groups.column)
        });
    }

    return stack;
}

module.exports = function (error) {
    let stack = parseStack(error.stack);
    console.log(`🚨  ${chalk.bgRed('Error')}: ${error.message}`);

    console.group();

    if (error.frame) {
        console.log();
        console.log(error.frame);
    }
    
    console.log();
    stack.forEach(stackItem => {
        console.log(
            `- ${chalk.yellow(`${stackItem.fileName}:${stackItem.line}`)} ${
                stackItem.name
            }`
        );
        console.log(
            `  ${chalk.grey(
                `${stackItem.filePath}:${stackItem.line}:${stackItem.column}`
            )}`
        );
        console.log('');
    });
    console.groupEnd();
}
