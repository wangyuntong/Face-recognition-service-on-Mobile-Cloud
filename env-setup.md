## Configure the environment

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
5.Install CUDA
6.Install package used in the lua script.
```
luarocks install image
luarocks install nngraph
luarocks install cunn
```

