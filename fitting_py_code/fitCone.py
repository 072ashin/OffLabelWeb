import numpy as np
import math
from distance2cone import *
from scipy.optimize import least_squares


def fitCone(P, dx, dy, dz, px, py, pz, w):
    '''
    Fit a cone to n 3D-points in P given the initial estimate of it
    Input: P,x,y,z,r
        P: list of 3D points, is of size n*3
        dx, dy, dz: the cone's axis
        px, py, pz: the cone's apex
        w: the cone's opening angle
    Output: dx, dy, dz, px, py, pz, w
    '''
    cone_axis = np.array([dx, dy, dz])
    cone_apex = np.array([px, py, pz])
    cone_angle = w;
    p0 = cone_apex + np.dot(cone_axis, np.inner(-cone_apex, cone_axis))
    # dx dy...should be a number instead of vector
    p0p1 = np.dot(np.sqrt(np.dot(p0, p0.T)), np.tan(cone_angle))
    p1 = p0 + np.dot(cone_axis, p0p1)

    if np.dot((p1 - cone_apex), (p1 - cone_apex).T) < np.dot((p0 - cone_apex), (p0 - cone_apex).T):
        p1 = p0 - np.dot(cone_axis, p0p1)

    n = p1
    # rho = np.dot(np.sqrt(np.dot(np.cross(-cone_apex, cone_axis), np.cross(-cone_apex, cone_axis).T)),
    #            np.cos(cone_angle)) - np.dot(np.abs(-cone_apex * cone_axis), np.sin(cone_angle))
    rho = np.sqrt(np.dot(np.cross(-cone_apex, cone_axis), np.cross(-cone_apex, cone_axis))) * np.cos(
        cone_angle) - np.abs(np.dot(-cone_apex, cone_axis) * np.sin(cone_angle))
    norm_n = np.sqrt(np.dot(n, n.T))
    n=n/norm_n
    k = 1 / (norm_n - rho)

    # n should be a vector otherwise cannot use n[1] for the 2nd element
    phi = np.arctan2(n[1], n[0])
    zeta = np.arccos(n[2])
    sigma = np.arctan2(cone_axis[1], cone_axis[0])
    tau = np.arccos(cone_axis[2])
    #####Solve nonlinear least-squares (nonlinear data-fitting) problems
    p0 = np.array([rho, phi, zeta, sigma, tau, k])
    out = least_squares(distance2cone, p0, jac=JacobianofCone, method='trf',
                        bounds=([-np.inf, -np.pi, 0, -np.pi, 0, 0], [np.inf, np.pi, np.pi, np.pi, np.pi, np.inf]),
                        args=([P]))
    out = out.x
    ####End
    rho = out[0]
    phi = out[1]
    zeta = out[2]
    sigma = out[3]
    tau = out[4]
    k = out[5]
    n[0] = np.cos(phi) * np.sin(zeta)
    n[1] = np.sin(phi) * np.sin(zeta)
    n[2] = np.cos(zeta)
    cone_axis[0] = np.cos(sigma) * np.sin(tau)
    cone_axis[1] = np.sin(sigma) * np.sin(tau)
    cone_axis[2] = np.cos(tau)

    cone_apex = n * (rho + 1 / k) - cone_axis / (k * np.dot(n, cone_axis))
    cone_angle = np.arcsin(np.abs(np.dot(n, cone_axis)))
    dx = cone_axis[0]
    dy = cone_axis[1]
    dz = cone_axis[2]
    px = cone_apex[0]
    py = cone_apex[1]
    pz = cone_apex[2]
    w = cone_angle
    return dx, dy, dz, px, py, pz, w
