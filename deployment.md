Deployment of the Readme Systems software to local Virtualbox and Amazon AWS

## Requirements
#### PLEASE read the development guide first. Must have Maven 3.1.1 or above to run the build.
#### Required software
   - Install Virtualbox 4.2.18
   - Install Vagrant 1.3.4
   
#### Software packages needed for the deployment

Copy the following into the 'deployment/vagrant-readmesys/packages/' folder. 

Create several folders, "storm", "cassandra", "jdk", "other"

   - storm/zookeeper-3.4.5.tar.gz
   - storm/storm-0.8.2.zip
   - cassandra/apache-cassandra-2.0.1-bin.tar.gz
   - jdk/jdk-7u40-linux-x64.tar.gz
   - other/apache-tomcat-7.0.42.tar.gz
   
#### If you want to rsync any files to AWS instance

Use the following command by getting the rsh connect string from AWS

    rsync -rave "ssh -i Tomcat_Dev.pem" /Test/file  ubuntu@54.200.137.105:/vagrant/data
    
   
## Start Applications in VMs

   Instances are deployed in "groups",  To launch a group of related instances specify the optional group shown below. For example, the following two runs deploy the xyz group in batches starting with the ip_addresses ending in 130.  
   Run the following to start the services deployed in Virtual box
    
     group=xyz ip_start=105 http_port=8085 storm_port=8086 vagrant up --provider=virtualbox
     
   To deploy the same to Amazon AWS, run (Note: http_port and storm_port are not specified)
   
     group=xyz ip_start=130 vagrant up --provider=aws --no-parallel
     
   Make sure to add all these port exceptions in AWS for Storm, Web UI
   
	2000
	2181
	3772
	8080 
	8081
	9042
	9160
	6627
    
     
## Cassandra Topology

   Single node Cassandra test cluster
   
   1. Login and verify if the Cassandra database id running properly
  
        ./bin/cqlsh dbserver 9160
        use readmesys;
        select * from metric_rollup_3600;
        
### Schema Updates

   1. To make schema updates on the Virtual Box instance from your local device:
	
	    cd <readmesys>/domain/src/main/resources/schema
	    cqlsh dbserver 9160 < readmesys.cql
	    cqlsh dbserver 9160 < factorySetup.cql
	    cqlsh dbserver 9160 < sampleData.cql
	    
   2.  To make schema updates on AWS use the **Elastic IP address** for the dbserver from your local device, eg.:
   
   	    cd <readmesys>/domain/src/main/resources/schema
   	    cqlsh 54.200.138.60 9160 < readmesys.cql
   	    cqlsh 54.200.138.60 9160 < factorySetup.cql
   	    cqlsh 54.200.138.60 9160 < sampleData.cql

### Fixing a corrupt C* Node
1. SSH into the dbserver node
2. Disable C* external interfaces

 		nodetool disablegossip
 		nodetool disablethrift
 		nodetool disablebinary
3. Drain the node

		nodetool drain
4. Remove commit logs

		sudo rm -rf /var/lib/cassandra/commitlog/
5. Restart cassandra

    	sudo start cassandra-server
    
6. Repair cassandra

		nodetool repair
		
	       
   
## Tomcat Server
  0. Modify <readmesys>/util/src/main/resources/dev.properties file :
        
        storm.connect.url=stormserver:2181
        db.endpoint=dbserver
        
  1. Build and deploy Readme Systems webapp into running 'tomcatserver' by doing
   
       Build the readmsys project and it's modules
       
        cd to <readmesys> project
        mvn clean install -Dmaven.test.skip=true
            
       Deploy the webapp to the running Tomcat server:
       
        cd to <readmesys>/webapp project
        
       In case of Amazon AWS, use the **Elastic IP address** for *-Dtomcat.url=http://54.200.135.120:8080/manager/text*

        mvn -Dmaven.test.skip=true tomcat7:deploy -Dtomcat.username=admin -Dtomcat.password=9PawHSaq696{Y~% -Dmaven.tomcat.url=http://54.200.204.178:8080/manager/text
      
  2. Access the web application deployed into Tomcat at
  
        http://tomcatserver:8080/webapp
        
## Storm topology

Refer to [Running a Multi-Node Storm Cluster](http://www.michael-noll.com/tutorials/running-multi-node-storm-cluster/)

![Clone repository](http://www.michael-noll.com/blog/uploads/Storm_multi-node-cluster_overview.png)

  1. Running Storm daemons under supervision
  
     Use  Upstart config scripts to startup a storm cluster and its components. These are taken from the GitHub project from [here](https://github.com/nerdynick/storm-upstart)
     
  2. Verify if the Storm cluster is running properly

     - Verifying ZooKeeper operation with status command
       
            echo stat | nc 54.200.155.251 2181
         
     - Verifying Storm Cluster using Storm UI interface at 
        
            http://54.200.155.251:8081/
   
  3. Build Storm topology jar for deployment
  
        cd to <readmesys> project
        mvn install -Dmaven.test.skip=true
        
     This builds a standalone JAR with all dependencies and located at
       
        analytics/target/analytics-0.1.0.BUILD-SNAPSHOT-jar-with-dependencies.jar
        
  4. Deploy the analytics topology into running cluster using the following command
  
     In case of Amazon AWS, use the **Elastic IP address** for *-c nimbus.host=54.200.155.251* to upload the topology uber jar
     
     Check in Storm UI to see if the deployed topology 'visitorTrends' is 'ACTIVE'
  
         /usr/local/storm/bin/storm jar analytics/target/analytics-0.1.0.BUILD-SNAPSHOT-jar-with-dependencies.jar readmesys.apps.TopologyRunner 3 -c nimbus.host=54.200.155.251
      
      
      To kill the topology, use
      
         /usr/local/storm/bin/storm kill visitorTrends -c nimbus.host=54.200.155.251
    
  5. Run the sample java program 'SensorDataToStorm' to send simulates visitors
  
  6. Log into the Strom machine for diagnostics located at
    
       - Look at worker logs at for the event processing info
  
            ls /usr/local/storm/logs
            tail -f /usr/local/storm/logs/worker-6701.log
         
       - Once we have started the various Storm daemons later on you will see files being created under storm.local.dir, they are at
       
            sudo tree /app/storm
            /app/storm
            +--- nimbus
                 +--- inbox
  
