require 'nngraph' 
require 'cunn'
require 'image'

--global params
local detThresh = torch.log(0.40)
local path = '/home/ubuntu/Face-recognition-service-on-Mobile-Cloud'
--model config
local numDet = 14 --number of detectors
local rfW = {12,16,20,24,28,32,36,40,44,48,52,56,60,64} --RFs
local skp = {1,1,1,1,2,2,2,2,2,2,2,4,4,4} --skip vals
local nnF = path .. '/facedet.nn'

--put net in 'global' space in this script
local net   = torch.load(nnF)
net   = net:cuda()

