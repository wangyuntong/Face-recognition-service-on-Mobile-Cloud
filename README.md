# Face-recognition-service-on-Mobile-Cloud

## Cloud Part Step by Step

### Step1. Set up a virtual machine.

Please follow this link below to set up the VM of Linux Ubuntu on Amazon AWS. The goal is to use this VM to run CNN model and detect faces. 

[AWS EC2 Get Started](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html)

Here I uses the AMI that our course Neural Networks and Deep Learning provided, named E6040 in public AMI. And the storage should be larger than 10 GB.

### Step2. Configure the environment on VM

1.Using ssh to enter the amazon instance. Here we use Linux Ubuntu instance.
```
ssh -i myKeyPair.pem ubuntu@your-EC2-instance-public-IP
```
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
And configure torch environment PATH:
The script adds torch to your PATH variable. You just have to source it once to refresh your env variables. The installation script will detect what is your current shell and modify the path in the correct configuration file.
```
# On Linux with bash
source ~/.bashrc
# On Linux with zsh
source ~/.zshrc
# On OSX or in Linux with none of the above.
source ~/.profile
```
5.Install CUDA. (only do this when you're working with CUDA)
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
luarocks install sys
```
If you're configuring with CUDA, you should also install 'cunn' package:
```
luarocks install cunn
```
7.Upload model ```facedet.nn``` (with CUDA) or ```facedet_nocuda_double.nn``` (without CUDA) and FDDB database (for test) to Amazon EC2 using scp:
```
scp -i ~/.ssh/AmazonRSA/yuntong_keypair.pem facedet.nn ubuntu@52.90.105.72:/home/ubuntu/Face-recognition-service-on-Mobile-Cloud
```
