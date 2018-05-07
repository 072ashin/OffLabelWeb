import numpy as np

def distance2sphere(x, P):
    '''
    % Calculate modified signed distance of each point in each row of P to the sphere
    % parameterized by x = (rho phi zeta k)
    % Input:
    %     x : tuple of 4 real numbers (rho phi zeta k) describing the sphere
    %     P : n queries of 3-D points of size n * 3
    % Output:
    %     F is of size n * 1 are the modified signed distances corresponding to each point in P
    %     J is of size n * 4 are the Jacobian of F with respect to x
    :param x:
    :param P:
    :return:
    '''

    rho = x[0]
    phi = x[1]
    zeta = x[2]
    k = x[3]
    n = np.array([np.cos(phi) * np.sin(zeta), np.sin(phi) * np.sin(zeta), np.cos(zeta)])
    s = P.shape[0]
    ff=np.sum((P - rho * np.tile(n, [s, 1])) ** 2, axis=1)
    ww=(P - rho * np.tile(n, [s, 1])) * np.matrix(n).T
    F = (k / 2) * np.sum((P - rho * np.tile(n, [s, 1])) ** 2, axis=1) - np.dot(P - rho * np.tile(n, [s, 1]),n)
    return F

def Jacobian_of_spere(x, P):
    rho = x[0]
    phi = x[1]
    zeta = x[2]
    k = x[3]
    n = np.array([np.cos(phi) * np.sin(zeta), np.sin(phi) * np.sin(zeta), np.cos(zeta)])
    s = P.shape[0]
    J = np.zeros([s,4])
    J = np.matrix(J)
    n_phi=np.array([-np.sin(phi)*np.sin(zeta), np.cos(phi)* np.sin(zeta), 0])
    n_zeta=np.array([np.cos(phi)*np.cos(zeta), np.sin(phi)*np.cos(zeta), -np.sin(zeta)])
    J[:,0] = k* (np.tile(rho, [s,1]) - P * np.matrix(n).T) + np.ones([s,1])
    J[:,1]=(-k*rho -1)*P* np.matrix(n_phi).T
    J[:,2] = (-k*rho -1)*P* np.matrix(n_zeta).T
    J[:,3]=1/2 * (np.matrix(np.sum(P**2,axis=1)).T - 2*rho*P*np.matrix(n).T + np.tile(rho*rho, [s,1]))
    J=np.array(J)
    return J
