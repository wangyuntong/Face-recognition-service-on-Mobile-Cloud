require 'nngraph' 
require 'cunn'
require 'image'

--global params
local detThresh = torch.log(0.40)
local nmsThresh = 0.3
local scaleDownF = 0.8
local path = '/home/ubuntu/Face-recognition-service-on-Mobile-Cloud'
--model config
local numDet = 14 --number of detectors
local rfW = {12,16,20,24,28,32,36,40,44,48,52,56,60,64} --RFs
local skp = {1,1,1,1,2,2,2,2,2,2,2,4,4,4} --skip vals
local nnF = path .. '/facedet.nn'

--FDDB images
local maxW   = 240
local minW   = 68
local dataPx = path .. '/FDDB/FDDB-folds/FDDB-fold-'
local numFld = 10
local imgSrc = path .. '/FDDB/'

--put net in 'global' space in this script
local net   = torch.load(nnF)
net   = net:cuda()

--adapted from Malisiewicz et al.
function NMS (boxT, overlapT)

    local retT = {}

    --if there are no boxes, return an empty list
    if (boxT:size():size() == 0) then
        return retT
    end

    local numRect = boxT:size(1)
    assert( boxT:size(2) == 5 )

    local maskT = torch.ByteTensor( numRect ):fill(1)

    local identT = torch.IntTensor( numRect )
    for ii=1,numRect do identT[ii] = ii end

    --grab the coordinates of the bounding boxes
    local x1 = boxT[{ {}, {1} }]
    local y1 = boxT[{ {}, {2} }]
    local x2 = x1 + boxT[{ {}, {3} }]
    local y2 = y1 + boxT[{ {}, {4} }]
    local detV = boxT[{ {}, {5} }] --detection scores

    --compute the area of the bounding boxes and sort the bounding
    --boxes by the bottom-right y-coordinate of the bounding box
    local area = torch.cmul((x2 - x1 + 1) , (y2 - y1 + 1))
    -- sortV, sortI = torch.sort(y2, 1, true) --true causes descending sort

    --keep looping while some indexes still remain in the indexes list
    local numProc = 0
    while (numProc < numRect) do

        --grab the last index in the indexes list and add the
        --index value to the list of picked indexes
        local thisI = 0
        -- for ii=1,numRect do
        --     thisI = sortI[ii][1]
        --     if (maskT[thisI] == 1) then break end
        -- end
	--grab largest remaining score
	local maxScr = -10000.0;
	for ii=1,numRect do
	    if ( (maskT[ii] == 1) and (detV[ii][1] > maxScr) ) then
		thisI = ii
		maxScr = detV[ii][1]
	    end
	end

        maskT[thisI] = 0
        numProc = numProc + 1

	if (numProc == numRect) then
	    table.insert(retT, thisI)
	    break
	end

        --find the largest (x, y) coordinates for the start of
        --the bounding box and the smallest (x, y) coordinates
        --for the end of the bounding box
        local xx1 = torch.cmax(x1[maskT], x1[thisI][1])
        local yy1 = torch.cmax(y1[maskT], y1[thisI][1])
        local xx2 = torch.cmin(x2[maskT], x2[thisI][1])
        local yy2 = torch.cmin(y2[maskT], y2[thisI][1])

        local idRM = identT[maskT]

        --compute the width and height of the bounding box
        local thisW = torch.cmax(xx2 - xx1 + 1, 0)
        local thisH = torch.cmax(yy2 - yy1 + 1, 0)

        --compute the ratio of overlap
        -- local overlap = torch.cdiv( torch.cmul(thisW,thisH), area[maskT])
	local overlapA = torch.cmul(thisW,thisH)
        local overlap1 = torch.cdiv( overlapA, area[maskT] )
        local overlap2 = overlapA / area[thisI][1] 
	local overlap  = torch.cmax( overlap1, overlap2 )

        --delete all indexes from the index list that have
        --larger than threshold overlap
        local maxScr = detV[thisI][1]
        local maxIdx = thisI
        for ii=1,overlap:size(1) do
            local gIdx = idRM[ii]
            if (overlap[ii] > overlapT) then
                if (detV[gIdx][1] > maxScr) then
                    maxScr = detV[gIdx][1]
                    maxIdx = gIdx
                end
                maskT[gIdx] = 0
                numProc = numProc + 1
            end
        end
        table.insert(retT,maxIdx)

    end

    --return only the bounding boxes that were picked using the
    --integer data type
    return retT
end

function findFaces (imgG, scale, detT)

    local newH = math.ceil(imgG:size(2) * scale)
    local newW = math.ceil(imgG:size(3) * scale)
    local imgS = image.scale(imgG,newW,newH)

    imgS:add(-0.5)

    imgS = imgS:double()
    imgS = imgS:cuda()
   
    local prediction = net:forward(imgS)

    --detected faces
    for dl=1,numDet do

        local tP = prediction[dl][{{1},{},{}}]
        local tN = prediction[dl][{{2},{},{}}]
        local tD = tP - tN
        local logZ = tN + torch.log1p(torch.exp(tD))

	--log prob
        tP = tP - logZ

	local hVal = math.ceil( rfW[dl] / scale )

	local numR = tP:size(2)
	local numC = tP:size(3)

	local ix = 0
	local iy = 0
	tP:apply( function (x)
		ix = ix%numC + 1
		if (ix == 1) then iy = iy + 1 end
		if ( x > detThresh ) then
		    xVal = math.ceil( ((ix-1)*skp[dl] + 1) / scale )
		    yVal = math.ceil( ((iy-1)*skp[dl] + 1) / scale )
		    table.insert(detT, {xVal, yVal, hVal, hVal, x})
		end
	        return x
	end )
    end
    
    return table.getn(detT)

end
