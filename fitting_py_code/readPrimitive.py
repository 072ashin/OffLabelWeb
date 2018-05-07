import sys
import numpy as np
from fitPlane import fitPlane
from fitCylinder import fitCylinder
from fitCone import fitCone
from fitSphere import fitSphere

def readPrimitve( A, points):
    A =  np.fromstring(A, sep=',')
    points = np.fromstring(points, sep=',').reshape(-1, 3)
    if A[-1] == 0:
        x, y, z, nx, ny, nz = fitPlane(points, A[0], A[1], A[2], A[3], A[4], A[5])
        data_type = 0
        output = np.array([data_type, points.shape[0], x, y, z, nx, ny, nz])
    elif A[-1] == 1:
        dx, dy, dz, px, py, pz, r = fitCylinder(points, A[3], A[4], A[5], A[0], A[1], A[2], A[6])
        data_type = 2
        output = np.array([data_type, points.shape[0], dx, dy, dz, px, py, pz, r])
    elif A[-1] == 2:
        dx, dy, dz, px, py, pz, w = fitCone(points, A[0], A[1], A[2],A[3], A[4], A[5], A[6])
        data_type = 3
        output = np.array([data_type, points.shape[0], dx, dy, dz, px, py, pz, w])
    elif A[-1] == 3:
        x,y,z, r = fitSphere(points, A[0], A[1], A[2], A[6])
        data_type = 1
        output = np.array([data_type, points.shape[0], x,y,z, r])
    opStr = ','.join(str(e) for e in output)
    print(opStr)
readPrimitve(sys.argv[1], sys.argv[2])