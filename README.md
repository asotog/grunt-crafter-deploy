# grunt-crafter-deploy

> Crafter Studio deployer for assets such as images, js or css

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-crafter-deploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-crafter-deploy');
```

## The "crafter_deploy" task

### Overview
In your project's Gruntfile, add a section named `crafter_deploy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  crafter_deploy: {
    options: {
      // Task-specific options go here.
    },
    files: {
      // Destination paths map and file lists  go here.
    },
  },
});
```

### Options

#### options.protocol
Type: `String`
Default value: `'http'`

A string value that is used to specify if connection will be regular or 'https'.

#### options.host
Type: `String`
<strong>Required</strong>

A string value that is used to define the server host.

#### options.port
Type: `Integer`
Default value: `null`

An integer value that is used to define the server port.

#### options.site
Type: `String`
<strong>Required</strong>

Site where files are going to be deployed.

#### options.username
Type: `String`
<strong>Required</strong>

User's email required for crafter studio login.

#### options.password
Type: `String`
<strong>Required</strong>

User's password required for crafter studio login.

#### options.loginPath
Type: `String`
Default value: `'/alfresco/service/api/login'`

Login service path to retrieve the alfresco ticket id.

#### options.uploadFilePath
Type: `String`
Default value: `'/alfresco/s/cstudio/wcm/content/upload-content-asset'`

Upload files service path.

### Usage Examples

#### Simple example
In this example, 2 files are going to be set for deployment into the same crafter studio folder. Also as a good practice, configuration will be defined in an external file called `crafter.json` relative to the Gruntfile.js

#####crafter.json
```json
{
    "username": "EMAIL",
    "password": "PASSWORD",
    "host": "SERVER_HOSTNAME",
    "site": "SITENAME"
}
```

#####Gruntfile.js
```js
grunt.initConfig({
  crafter_config: grunt.file.readJSON('crafter.json'),
  crafter_deploy: {
    cloud: {
        options: {
            host: '<%= crafter_config.host %>',
            username: '<%= crafter_config.username %>',
            password: '<%= crafter_config.password %>',
            site: '<%= crafter_config.site %>'
        },
        files: {
            '/static-assets/js/': ['src/file1.js', 'src/file2.js']
        }
    }
  },
});
```

So now, `file1.js` and `file2.js` can be deployed into crafter studio `/static-assets/js/` by running the task from commandline:

```
grunt crafter_deploy:cloud
```

## Contributing
Feel free to fork it and modify it by your self :p

## Release History
_(Nothing yet)_
