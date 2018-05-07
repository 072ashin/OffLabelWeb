import numpy as np
from distance2cylinder import *
from scipy.optimize import leastsq
from scipy.optimize import least_squares

def fitCylinder(P, dx, dy, dz, px, py, pz, r):
    '''
    % Fit the cylinder to n 3D-points in P given the initial estimate of the cylinder
    % Input: P, dx, dy, dz, px, py, pz, r
    %     P : list of 3D-points, is of size n * 3
    %     dx dy dz : vector indicates the axis of the cylinder
    %     px py pz : a point on the rotational axis of the cylinder
    %     r : the radius of the cylinder
    % Output: dx dy dz px py pz r
    :param P:
    :param dx:
    :param dy:
    :param dz:
    :param px:
    :param py:
    :param pz:
    :param r:
    :return:
    '''
    k = 1 / r
    tmp1 = np.array([dx, dy, dz])
    tmp2 = np.array([-px, -py, -pz])

    t = np.inner(tmp1, tmp2)/ np.linalg.norm(tmp1)
    x = px + t * dx
    y = py + t * dy
    z = pz + t * dz
    rho = np.sqrt(x ** 2 + y ** 2 + z ** 2) - r
    phi = np.arctan2(y, x)
    zeta = np.arccos(z / np.sqrt(x ** 2 + y ** 2 + z ** 2))
    n_zeta = np.array([np.cos(phi) * np.cos(zeta), np.sin(phi) * np.cos(zeta), -np.sin(zeta)])
    n_phi_bar = np.array([-np.sin(phi), np.cos(phi), 0])
    cos_alpha = np.sum(tmp1 * n_zeta) / np.linalg.norm(tmp1)
    sin_alpha = np.sum(tmp1 * n_phi_bar) / np.linalg.norm(tmp1)
    alpha = np.arccos(cos_alpha) * np.sign(sin_alpha)
    alpha = max(alpha, -np.pi)
    alpha = min(alpha, np.pi)

    #####Solve nonlinear least-squares (nonlinear data-fitting) problems
    p0 = np.array([rho, phi, zeta, alpha, k])
    out = least_squares(distance2cylinder, p0, jac=JacobianofCylinder, method='trf', bounds=([-np.inf, -np.pi, 0, -np.pi, 0],[np.inf,np.pi,np.pi,np.pi,np.inf]), args=([P]))
    out = out.x
    ####End

    r = 1 / out[4]
    px = (out[0] + r) * np.cos(out[1]) * np.sin(out[2])
    py = (out[0] + r) * np.sin(out[1]) * np.sin(out[2])
    pz = (out[0] + r) * np.cos(out[2])
    dx = np.cos(out[1]) * np.cos(out[2]) * np.cos(out[3]) - np.sin(out[1]) * np.sin(out[3])
    dy = np.sin(out[1]) * np.cos(out[2]) * np.cos(out[3]) + np.cos(out[1]) * np.sin(out[3])
    dz = -np.sin(out[2]) * np.cos(out[3])

    return dx, dy, dz, px, py, pz, r
