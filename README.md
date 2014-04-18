# How to make the project running simulation
This is a guide for the first time user. Other documentation please click [here] (https://github.com/ReadmeSystemsInc/readmesys/tree/master/documents "Documantation")

## Table of contents

* [Prerequisite] (#prerequisite-apr-18th-2014 "look down")
* [Install] (#install "look down")
* [Import the project and data] (#import-the-project-and-data "Jump") 
* [Verify the components] (#verify-the-components "Jump")
* [Run the simulation] (#run-the-simulation "To buttom")
* [Troubleshooting] (#troubleshooting "Ease your headache!")

## Prerequisite (Apr 18th, 2014)
* JDK 1.7 and above, ocrale JDK recommanded.
	
> java -version

* GitHub account
* Git 1.8.1.x
* Spring Tool Suite 3.4.x with Tomcat 7.x
* Apache Cassandra 2.0.x
* Maven 3.1.1 (To avoid compile compliant while in build process)

## Install
Install all required software, you can download 
* [JAVA EE 7] (http://www.oracle.com/technetwork/java/javaee/downloads/index.html) 
* Git client [here] (http://git-scm.com/download "Git"). 
* Optional - Git GUI [SourceTree] (http://www.sourcetreeapp.com/ "Windows & Mac OS ONLY") 
* Optional - Git GUI for Linux [gitk] (http://git-scm.com/docs/gitk "gitk")
* Spring Tool Suite [here] (http://spring.io/tools/sts/all "STS")
* [Apache Tomcat Eclipse Integration] (http://www.eclipse.org/webtools/jst/components/ws/1.5/tutorials/InstallTomcat/InstallTomcat.html)
* NoSQL database [Cassandra] (http://planetcassandra.org/Download/StartDownload)
* Maven 3.1.1 [here] (http://mirror.cogentco.com/pub/apache/maven/maven-3/3.1.1/binaries/apache-maven-3.1.1-bin.zip)

By default, Cassandra uses the following directories for data and commitlog storage

	/var/lib/cassandra
	/var/log/cassandra

Make sure that both of these directories exist and are writeable by Cassandra 

	sudo mkdir /var/lib/cassandra
 	sudo mkdir /var/log/cassandra
 	sudo chown -R $USER:$GROUP /var/lib/cassandra
 	sudo chown -R $USER:$GROUP /var/log/cassandra

## Import the project and data

### Start database server
Go to the source file folder

	;; Start Cassandra server in one shell
	./bin/cassandra -p cassandrapidfile

### Create schema with CQL client
1. Use the attached CQL script to create example keyspace/columnfamily. Create the needed keyspace/columnfamily by running
  
        ./bin/cqlsh < <repo-path>/readmesys/deployment/vagrant-readmesys/data/schema/readmesys.cql
        ./bin/cqlsh < <repo-path>/readmesys/deployment/vagrant-readmesys/data/schema/factorySetup.cql
        ./bin/cqlsh < <repo-path>/readmesys/deployment/vagrant-readmesys/data/schema/demoSetup.cql

### Setup webapp
1. Check out the readmesys project to local directory
2. Import existing Maven project using menu command
3. Run the **webapp* by selecting with menu command
   
        Run As/Run On Server with

Back to [Table of Contents] (#table-of-contents)

## Verify the components

Login the portal
 
	User Name:
	dianne@readmesys.com
	
	Password:
	emu

Add sensors to the demo

	click the "settings", then add one dummy sensor and one dummy gateway

Generate dummy data

Back to [Table of Contents] (#table-of-contents)

## Run the simulation

1. run project "webapp" as "Run on server"
2. execute "TopologyRunner.java" under project "analytics" as "Java Application"
3. execute "SensorDataToGatewayAPI.java" under project "simulator" as "Java Application"

Back to [Table of Contents] (#table-of-contents)

## Troubleshooting
### How to start the **Cassandra server** and **CQL client** ?
Go to the source file folder

	;; Start Cassandra server in one shell
	./bin/cassandra -p cassandrapidfile
	;; Start CQL 3.0 client in another shell
	./bin/cqlsh 
        
### How to shutdown the database? 
There is no "shutdown" command in cassandra, it's designed to be stopped by killing it. [source] (http://cassandra-user-incubator-apache-org.3065146.n2.nabble.com/How-to-shutdown-Cassandra-td5792663.html)

	;; Mac OS use this
	kill $(cat cassandrapidfile)
	;; Linux use this
	kill $(cat cassandrapidfile)
	kill $(ps ef |grep cassandra|grep java|cut -f2 -d" ")

Back to [Table of Contents] (#table-of-contents)
