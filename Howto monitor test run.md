Step1
>cd /home/mike/newDevelopment-Mar-25-2014/vagrant-readmesys
>vagrant ssh stormserver
>cd /opt/storm-0.9.0.1/logs

grep "MAC address"
>grep "40B395740B6D" worker-6703.log | tail

grep "HeartBeat"
>grep "Heart" worker-6700.log | tail | grep "Heart"
