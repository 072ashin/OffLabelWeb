import numpy as np
import math
from scipy.optimize import leastsq
from distance2plane import distance2plane

def fitPlane(P, x, y, z, nx ,ny, nz):
    '''
    % Fit a plane to n 3D-points in P given the initial estimate of it
% Input: P, x, y, z, nx, ny, nz
%       P : list of 3-D points, is of size n x 3, P(i, :) is the coordinates
%       of the i-th point
%       x, y, z : a point on the plane
%       nx, ny, nz : the normal vector of the plane
% Output: x, y, z, nx, ny, nz where [nx, ny, nz] is the plane normal vector
% and [x, y, z] is a representative point on that plane
    '''
    phi=np.arctan2(ny,nx)
    zeta=np.arccos(nz/np.sqrt(nx**2+ny**2+nz**2))
    a=np.array([x,y,z])
    #is phi zerta a number?
    b=np.array([np.cos(phi)*np.sin(zeta),np.sin(phi)*np.sin(zeta),np.cos(zeta)])
    rho=-np.sum(a*b)
    #####Solve nonlinear least-squares (nonlinear data-fitting) problems
    p0=np.array([rho, phi, zeta])

    out=leastsq(distance2plane,p0,args=(P))
    out=out[0]
    ####End
    nx=np.cos(out[1])*np.sin(out[2])
    ny=np.sin(out[1])*np.sin(out[2])
    nz=np.cos(out[2])
    x=np.mean(P[:,0])
    y=np.mean(P[:,1])
    z=np.mean(P[:,2])

    return x,y,z,nx,ny,nz
