# Face-recognition-service-on-Mobile-Cloud

## Cloud Part Step by Step

## Step1. Set up a virtual machine.

Please follow this link below to set up the VM of Linux Ubuntu on Amazon AWS. The goal is to use this VM to run CNN model and detect faces. 
[AWS EC2 Get Started](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html)

## Step2. Configure the environment on VM

1.Using ssh to enter the amazon instance. Here we use Linux Ubuntu instance.
2.install git on VM. 
```
sudo apt-get install git
```
3.Clone project from my repository.
```
git clone https://github.com/wangyuntong/Face-recognition-service-on-Mobile-Cloud.git
```
4.Install torch.
```
git clone https://github.com/torch/distro.git ~/torch --recursive
cd ~/torch; bash install-deps;
./install.sh
```
5.Install CUDA. 
```
cd env
sudo dpkg -i cuda-repo-ubuntu1504_7.5-18_amd64.deb
sudo apt-get update
sudo apt-get install cuda
```
6.Install package used in the lua script.
```
luarocks install image
luarocks install nngraph
luarocks install cunn
```
