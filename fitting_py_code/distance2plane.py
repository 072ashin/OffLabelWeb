import numpy as np

def distance2plane(x,P):
    '''
    % Calculate signed distance of each point in each point of P to the plane
% parameterized by x = (rho, phi, zeta)
% Input:
%       x : tuple of 3 real numbers (rho, phi, zeta) describing the plane
%       P : n queries of 3-D points of size n x 3 where P(i, :) is the
%       coordinates of the i-th point
% Output:
%       F is of size n x 1 is the modified signed distances corresponding
%       to each point in P
%       J is of size n x 3 is the Jacobian of F with respect to x
    '''

    rho=x[0]
    phi=x[1]
    zeta=x[2]
    n=np.array([np.cos(phi)*np.sin(zeta),np.sin(phi)*np.sin(zeta),np.cos(zeta)])
    ###This part has some problems ### now solved
    F = np.dot(P, n.T)
    F=np.reshape(F,[P.shape[0],1])
    F=F+rho*np.ones([P.shape[0],1])
    J=np.zeros([P.shape[0],3])
    n_phi=np.array([-np.sin(phi)*np.sin(zeta),np.cos(phi)*np.sin(zeta),0])
    n_zeta=np.array([np.cos(phi)*np.cos(zeta),np.sin(phi)*np.cos(zeta),-np.sin(zeta)])
    # J[:,0]=1
    # J[:,1]=np.dot(P,n_phi.T)
    # J[:,2]=np.dot(P,n_zeta.T)
    F=F.reshape(1,F.shape[0])
    F=F[0]
    return F


