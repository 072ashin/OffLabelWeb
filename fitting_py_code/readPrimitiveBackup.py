import numpy as np
from fitPlane import fitPlane
from fitCylinder import fitCylinder
from fitCone import fitCone
from fitSphere import fitSphere

A = np.loadtxt("sphere_example/parameters.txt", delimiter=",")
points = np.loadtxt("sphere_example/centroids2.txt", delimiter=",")

if A.size != 0 and points.size != 0:
    if A[-1] == 0:
        x, y, z, nx, ny, nz = fitPlane(points, A[0], A[1], A[2], A[3], A[4], A[5])
        data_type = 0
        output = np.array([data_type, points.shape[0], x, y, z, nx, ny, nz])
        with open('plane_example/result.txt', 'a') as file:
            file.seek(0)
            file.truncate()
            for i in range(output.shape[0]):
                write_str = '%f \n' % (output[i])
                file.write(write_str)
    elif A[-1] == 1:
        dx, dy, dz, px, py, pz, r = fitCylinder(points, A[3], A[4], A[5], A[0], A[1], A[2], A[6])
        data_type = 2
        output = np.array([data_type, points.shape[0], dx, dy, dz, px, py, pz, r])
        with open('cylinder_example/myresult.txt', 'a') as file:
            file.seek(0)
            file.truncate()
            for i in range(output.shape[0]):
                write_str = '%f \n' % (output[i])
                file.write(write_str)
    elif A[-1] == 2:
        dx, dy, dz, px, py, pz, w = fitCone(points, A[3], A[4], A[5], A[0], A[1], A[2], A[6])
        data_type = 3
        output = np.array([data_type, points.shape[0], dx, dy, dz, px, py, pz, w])
        with open('cone_example/myresult.txt', 'a') as file:
            file.seek(0)
            file.truncate()
            for i in range(output.shape[0]):
                write_str = '%f \n' % (output[i])
                file.write(write_str)
    elif A[-1] == 3:
        x,y,z, r = fitSphere(points, A[0], A[1], A[2], A[6])
        data_type = 1
        output = np.array([data_type, points.shape[0], x,y,z, r])
        with open('sphere_example/myresult.txt', 'a') as file:
            file.seek(0)
            file.truncate()
            for i in range(output.shape[0]):
                write_str = '%f \n' % (output[i])
                file.write(write_str)
