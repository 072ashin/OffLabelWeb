import numpy as np
from scipy.optimize import least_squares
from distance2sphere import *


def fitSphere(P, x, y, z, r):
    '''
    % Fit a sphere to n 3D-points in P given the initial estimate of it
    % Input: P, x, y, z, r
    %       P : list of 3-D points, is of size n x 3, P(i, :) is the coordinates of the i-th point
    %       x, y, z : the center of the sphere
    %       r : the radius of the sphere
    %    Output: x, y, z, r: new sphere's parameters
    :param P:
    :param x:
    :param y:
    :param z:
    :param r:
    :return:
    '''
    nx = x
    ny = y
    nz = z
    t = np.linalg.norm(np.array([nx, ny, nz]))
    nx = nx / t
    ny = ny / t
    nz = nz / t
    phi = np.arctan2(ny, nx)
    zeta = np.arccos(nz / np.sqrt(nx ** 2 + ny ** 2 + nz ** 2))
    rho = np.sqrt(x ** 2 + y ** 2 + z ** 2)
    k = 1 / r

    #####Solve nonlinear least-squares (nonlinear data-fitting) problems
    p0 = np.array([rho, phi, zeta, k])
    # out = leastsq(distance2cylinder, p0, args=(P))
    # out = out[0]
    out = least_squares(distance2sphere, p0, jac=Jacobian_of_spere, method='trf',
                        bounds=([-np.inf, -np.pi, 0, 0], [np.inf, np.pi, np.pi, np.inf]), args=([P]))
    out = out.x
    ####End
    rho = out[0]
    nx = np.cos(out[1]) * np.sin(out[2])
    ny = np.sin(out[1]) * np.sin(out[2])
    nz = np.cos(out[2])

    r = 1 / out[3]
    x = (rho + r) * nx
    y = (rho + r) * ny
    z = (rho + r) * nz
    return x, y, z, r
