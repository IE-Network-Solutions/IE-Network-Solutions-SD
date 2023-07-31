// Log Function
log = async (message, req, res) => {
    // Get time and date
    let timeElapsed = Date.now();
    let today = new Date(timeElapsed);    
    let date = today.toLocaleDateString();
    let time = today.toLocaleTimeString();
    
    // Log Message
    let reqPrams = JSON.stringify(req.params);
    let reqQueries = JSON.stringify(req.queries);
    let resStatus = res.statusCode;
    let reqHost = JSON.stringify(
        {
            "hostName": req.hostName,
            "ip": req.ip,
            "path": req.path,
            "protocol": req.protocol,
            "route": req.route,
            "originalURL": req.originalUrl,
        }
    );
    let reqHeader = JSON.stringify(
        req.res._header,
    )
    let resHeader = JSON.stringify(
        res.header
    )
    let object = `Date: ${date} \nTime: ${time} \nMessage: ${message} \nState Details are as follows ---\n\tRequest Params: ${reqPrams} \n\tRequest Queries: ${reqQueries} \n\tResponse Status: ${resStatus} \n\tRequest Headers: ${reqHeader} \n\tResponse Headers: ${resHeader} \n\tHost Details: ${reqHost}\n`;
    

    // Write file
    const fs = require('fs');
    fs.appendFile(process.env.LOG_FILE_PATH, object.toString(), (err) => {
            if(err) {
                return console.log(err);
            }
        },
    ); 

}

module.exports = log;