function myFunction()
{
    var accessKeyId = document.getElementById("accessKeyId").value;
    var secretAccessKey = document.getElementById("secretAccessKey").value;
    var region = document.getElementById("region").value;
    var InstanceType = document.getElementById("InstanceType").value;
    if (accessKeyId === "")
    {
        $("#alertText").text("Access Key missing");
        $("#myModal").modal();
    }
    else if (secretAccessKey === "")
    {
        $("#alertText").text("Secret access Key missing");
        $("#myModal").modal();
    }
    else if (region === "")
    {
        $("#alertText").text("region missing");
        $("#myModal").modal();
    }
    else if (InstanceType === "")
    {
        $("#alertText").text("instance type missing");
        $("#myModal").modal();
    }
    else
    {
        launchInstance(accessKeyId, secretAccessKey, region, InstanceType);
    }
}

function launchInstance(accessKeyId, secretAccessKey, region, InstanceType)
{
    var ec2 = new AWS.EC2();
    ec2.endpoint = "ec2." + region + ".amazonaws.com";
    var config = new AWS.Config(
    {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    });

    var params = {
        ImageId: 'ami-15e9c770',
        InstanceType: InstanceType,
        MinCount: 1,
        MaxCount: 1
    };
    ec2.config = config;

    // Create the instance
    ec2.runInstances(params, function (err, data)
    {
        if (err)
        {
            if (err.code === "NetworkingError")
            {
                $("#alertText").text("Could not create instance, not a valid region");
            }
            else
            {
                $("#alertText").text("Could not create instance " + err);
            }

            $("#myModal").modal();
            return;
        }
        var instanceId = data.Instances[0].InstanceId;
        var instanceTime = data.Instances[0].LaunchTime
        var result = "Created instance with ID " + instanceId + " at time " + instanceTime;
        $('.results').append($('<div class="w-50 p-3 alert alert-success" id=' + instanceId + ' role="alert">' + result + '</div>'));


    });
}